import ProjectUser from "./ProjectUser";
import { useContext, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import React from "react";
import gsap from "gsap";
import axios from "../config/axios";
import { UserContext } from "../context/user.context";
import { sendMessage } from "../config/socket";
import ReactMarkdown from "react-markdown";
import Markdown from "markdown-to-jsx";

function ProjectLeftPart(props) {
    const { user } = useContext(UserContext);
    const panelRef = useRef(null);
    const messageBoxRef = useRef(null);
    const [panelOpen, setPanelOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [allCollaborator, setAllCollaborator] = useState([]);
    const [message, setMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState([]);
    const [inputMessage, setInputMessage] = useState("");

    useEffect(() => {
        if (messageBoxRef.current) {
            messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
        }
    }, [props.messages]);

    const getAllUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/user/all-users', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUsers(response.data.users);
            setModalOpen(true);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        setLoading(false);
    };

    const addUserToProject = async () => {
        try {
            console.log('get called');
            await axios.put('/project/add-users', {
                projectId: props?.projectId,
                users: selectedUser
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setModalOpen(false);
        } catch (error) {
            console.error("Error adding users:", error);
        }
        setLoading(false);
    };

    const allCollaborators = async () => {
        try {
            const response = await axios.post('/project/get-users', { projectId: props?.projectId }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            console.log(response.data);
            setAllCollaborator(response.data.users);
            setPanelOpen(true);
        } catch (error) {
            console.error("Error fetching collaborators:", error);
        }
    };

    const sendMessagetogroup = () => {
        if (!props.projectId || !message.trim()) return;
        sendMessage('project-message', {
            message,
            sender: user?.email,
            projectId: props.projectId
        });
        setMessage("");
        setInputMessage("");
    };

    useGSAP(() => {
        gsap.to(panelRef.current, { left: panelOpen ? '0%' : '-100%' });
    }, [panelOpen]);

    function aiMessage(message) {
        // console.log("Type of message:", typeof message);
        // console.log("Message content:", message);
    
        try {
        //     const messageObject = JSON.parse(message); // Parse safely
          props.setFileTree(message.fileTree);
            return (
                <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2">
                    <Markdown children={message.text} />
                </div>
            );
        } catch (error) {
            console.error("Error parsing AI message:", error);
            return <div className="text-red-500 p-2">Invalid AI response format.</div>;
        }
    }
    

    return (
        <div className="flex flex-col w-full h-full rounded-lg overflow-hidden">
            <div className="h-10 flex justify-between flex-row m-1">
                <button className="hover:bg-gray-100 cursor-pointer font-bold text-lg" onClick={getAllUsers}>
                    <i className="ri-user-add-fill"></i> Add Collaborator {loading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
                </button>
                <div className="h-full w-[15%] ml-9 flex justify-center cursor-pointer items-center rounded-full hover:bg-gray-200" onClick={allCollaborators}>
                    <i className="ri-team-fill text-2xl"></i>
                </div>
            </div>
            <div ref={messageBoxRef} className="message-box h-[94%] bg-orange-100 flex flex-col overflow-y-auto p-2">
                {props.messages.map((msg, index) => (
                    <div key={index} className={`relative flex flex-col w-70 min-w-[100px] font-sm border border-gray-300 rounded-lg p-1 m-1 ${msg.sender === "Ai" ? "bg-black text-white" : "bg-white"} ${msg.sender === user?.email ? "ml-auto outgoing" : "incoming"}`}>
                        <small className={msg.sender === "Ai" ? "text-green-400 font-bold" : ""}>{msg.sender === user?.email ? "You" : msg.sender}</small>
                        {msg.sender === 'Ai' ? aiMessage(msg.message) : <span>{msg.message}</span>}
                    </div>
                ))}
            </div>
            <div className="h-16 w-full m-1 flex flex-row">
                <input type="text" value={inputMessage} className="p-2 border w-full border-gray-400 rounded" placeholder="Send message" onChange={(e) => { setMessage(e.target.value); setInputMessage(e.target.value); }} />
                <div className="h-[86%] flex mt-1 justify-center items-center ml-2 rounded-lg w-12 hover:bg-gray-300" onClick={sendMessagetogroup}>
                    <i className="ri-send-plane-2-fill text-3xl"></i>
                </div>
            </div>
            {modalOpen && (
                <div className="fixed inset-0 bg-opacity-90 flex items-center z-20 justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold mb-4">Select Collaborator</h3>
                        <h1 className="font-bold w-10 h-10 rounded-full flex justify-center items-center hover:bg-gray-200" onClick={()=>{setModalOpen(false)}}>X</h1>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                            {users.map(user => (
                                <div key={user.email} onClick={() => setSelectedUser([...selectedUser, user.email])} className="p-2 cursor-pointer flex flex-row gap-3 hover:bg-gray-100 rounded">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center">
                                        <i className="ri-user-fill"></i>
                                    </div>
                                    {user.email}
                                </div>
                            ))}
                        </div>
                        <button className="bg-blue-600 w-full h-10 flex items-center justify-center text-white font-bold mt-2 rounded-lg" onClick={addUserToProject}>Add Collaborators</button>
                    </div>
                </div>
            )}
            <div ref={panelRef} className="sidepanel w-104 h-full absolute top-0">
                <ProjectUser setPanelOpen={setPanelOpen} allCollaborator={allCollaborator} />
            </div>
        </div>
    );
}

export default ProjectLeftPart;
