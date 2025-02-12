import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProjectLeftPart from "./ProjectLeftPart";
import ProjectRightPart from "./ProjectRightPart";
import { initializeSocket, receiveMessage } from "../config/socket";

function Project() {
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const projectId = location.state?.project._id;
 const [fileTree, setFileTree] = useState({})


    useEffect(() => {
        if (!location.state?.project?._id) {
            console.error("Error: Project ID is missing");
            return;
        }
        console.log("Initializing socket with projectId:", projectId);
        const socket = initializeSocket(projectId);

        receiveMessage('project-message', (data) => {
            console.log("Received message in frontend:", data);
            setMessages(prevMessages => [...prevMessages, data]);
        });

        return () => {
            socket?.disconnect();
        };
    }, [location.state?.project?._id]);

    const handleNewMessage = (msgData) => {
        setMessages(prev => [...prev, msgData]);
    };

    return (
        <main className="flex h-screen w-full flex-row">
            <div className="w-[27%] my-1">
                <ProjectLeftPart messages={messages} setFileTree={setFileTree} projectId={projectId} onNewMessage={handleNewMessage}/>
            </div>
            <div className="w-[72%] bg-red-200 ">
                <ProjectRightPart fileTree={fileTree} setFileTree={setFileTree}/>
            </div>
        </main>
    );
}

export default Project;