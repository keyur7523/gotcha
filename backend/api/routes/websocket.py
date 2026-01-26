from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import traceback

from services.session_store import session_store
from services.agent import AgentOrchestrator
from services.executor import executor

router = APIRouter(tags=["websocket"])


@router.websocket("/api/v1/ws/{session_id}")
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
            "timestamp": session.completed_at.isoformat() if session.completed_at else None,
            "data": {"result": session.result.model_dump() if session.result else None},
        })
        await websocket.close()
        return

    # Get session metadata (strictness, max_issues, custom_api_key)
    metadata = session_store.get_metadata(session_id)
    orchestrator = AgentOrchestrator(
        executor=executor,
        strictness=metadata.get("strictness"),
        max_issues=metadata.get("max_issues", 10),
        custom_api_key=metadata.get("custom_api_key"),
    )

    try:
        async for step in orchestrator.run_analysis(session_id):
            step_data = step.model_dump(mode="json")

            if step.action == "complete":
                final_session = session_store.get_session(session_id)
                if final_session and final_session.result:
                    step_data["data"] = {
                        **(step_data.get("data") or {}),
                        "result": final_session.result.model_dump(mode="json")
                    }

            await websocket.send_json(step_data)
    except WebSocketDisconnect:
        print(f"WebSocket disconnected for session {session_id}")
    except Exception as e:
        print(f"WebSocket error: {e}")
        traceback.print_exc()
        await websocket.send_json({"error": str(e)})
    finally:
        try:
            await websocket.close()
        except:
            pass
