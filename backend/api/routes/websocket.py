from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from services.session_store import session_store
from services.agent import AgentOrchestrator
from services.executor import executor

router = APIRouter(tags=["websocket"])


@router.websocket("/ws/{session_id}")
async def analysis_websocket(websocket: WebSocket, session_id: str):
    await websocket.accept()

    session = session_store.get_session(session_id)
    if not session:
        await websocket.send_json({"error": "Session not found"})
        await websocket.close()
        return

    if session.status == "completed":
        await websocket.send_json({
            "step_number": 0,
            "action": "complete",
            "description": "Analysis already completed",
            "data": {"result": session.result.model_dump() if session.result else None},
        })
        await websocket.close()
        return

    orchestrator = AgentOrchestrator(executor=executor)

    try:
        async for step in orchestrator.run_analysis(session_id):
            await websocket.send_json(step.model_dump(mode="json"))
    except WebSocketDisconnect:
        pass
    finally:
        await websocket.close()
