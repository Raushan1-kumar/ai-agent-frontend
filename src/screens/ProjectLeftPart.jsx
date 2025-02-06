import ProjectUser from "./ProjectUser";
import { useContext, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import React from "react";
import gsap from "gsap";
import axios from "../config/axios";
import { UserContext } from "../context/user.context";
import { sendMessage, receiveMessage } from "../config/socket";
import { data } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Markdown from "markdown-to-jsx";


function ProjectLeftPart(props) {


        const { user } = useContext(UserContext);
        const panelRef = useRef(null);
        const [panelOpen, setPanelOpen] = useState(false);
        const [modalOpen, setModalOpen] = useState(false);
        const [loading, setLoading] = useState(false);
        const [users, setUsers] = useState([])
        const [allCollaborator, setAllCollaborator] = useState([])
        const [message, setMessage] = useState('')
        const [selectedUser, setSelectedUser] = useState([]);
        const messageBoxRef = useRef(null);
        const [inputmessage, setInputMessage] = useState('')
       

        useEffect(() => {
                if (messageBoxRef.current) {
                        messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
                }
        }, [props.messages]);

        const getAllUsers = async () => {
                setLoading(true);
                await axios.get('/user/all-users', {
                        headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                }).then(response => {
                        console.log(response.data);
                        setUsers(response.data.users);
                        setLoading(false);
                        addUserToProject();
                        setModalOpen(true);
                })
        }


        const addUserToProject = async () => {
                const projectId = props?.projectId;
                await axios.put('/project/add-users', {
                        projectId: projectId,
                        users: selectedUser
                }, {
                        headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                }).then(response => {
                        console.log(response.data);
                        setLoading(false);
                        setModalOpen(false);
                }).catch(error => {
                        console.error(error);
                        setLoading(false);
                });
        }


        const allCollaborators = async () => {
                try {
                        const projectId = props?.projectId;
                        console.log("projectId: " + projectId);

                        const token = localStorage.getItem('token');

                        const response = await axios.post('/project/get-users',
                                { projectId },
                                {
                                        headers: {
                                                Authorization: `Bearer ${token}`
                                        }
                                }
                        );

                        setAllCollaborator(response.data.users)
                        setPanelOpen(true);
                } catch (err) {
                        console.error("Error fetching collaborators:", err.response?.data || err.message);
                }
        };

        const sendMessagetogroup = () => {
                if (!props.projectId) {
                        console.error("Error: Project ID is missing in sendMessagetogroup");
                        return;
                }

                if (message.trim()) {
                        const msgData = {
                                message,
                                sender: user?.email,
                                projectId: props.projectId
                        };
                        console.log("Sending message:", msgData);
                        sendMessage('project-message', msgData);
                        setMessage("");
                        setInputMessage(' ');
                }
        };

        useGSAP(function () {
                if (panelOpen) {
                        gsap.to(panelRef.current, {
                                left: '0%'
                        });
                } else {
                        gsap.to(panelRef.current, {
                                left: '-100%'
                        });
                }
        }, [panelOpen]);

        function aiMessage(message) {

                const messageObject = JSON.parse(message)

                return (
                        <div>
                                <Markdown
                                        children={messageObject.text}
                                />
                        </div>)
        }

        function saveFileTree(ft) {
                axios.put('/projects/update-file-tree', {
                        projectId: project._id,
                        fileTree: ft
                }).then(res => {
                        console.log(res.data) 
                }).catch(err => {
                        console.log(err)
                })
        }

        return (
                <>
                        <div className="flex flex-col w-full h-full rounded-lg overflow-hidden">
                                <div className="h-10 flex flex-row m-1 ">
                                        <div className="h-full w-[80%] ml-2 flex items-center font-bold text-lg">
                                                <button className="hover:bg-gray-100 cursor-pointer" onClick={getAllUsers}>
                                                        <i className="ri-user-add-fill"></i> <span >Add Collaborator {loading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}</span>
                                                </button>
                                        </div>
                                        <div className="h-full w-[15%] ml-2 flex justify-center cursor-pointer items-center  rounded-full hover:bg-gray-200" onClick={allCollaborators}>
                                                <i className="ri-team-fill w-full mt-3 ml-4 h-full text-2xl"></i>
                                        </div>
                                </div>
                                <div
                                        ref={messageBoxRef}
                                        className="message-box h-[94%] bg-orange-100 flex flex-grow flex-col overflow-y-auto p-2"
                                >
                                        {props.messages.map((msg, index) => (
                                                <div
                                                        key={index}
                                                        className={`relative flex flex-col w-70 min-w-[100px] font-sm border border-gray-300 rounded-lg p-1 m-1 
            ${msg.sender === "Ai" ? "bg-black text-white" : "bg-white"}
            ${msg.sender === user?.email ? "ml-auto outgoing" : "incoming"}
        `}
                                                >
                                                        <small
                                                                className={msg.sender === "Ai" ? "text-green-400 font-bold" : ""}
                                                        >
                                                                {msg.sender === user?.email ? "You" : msg.sender}
                                                        </small>
                                                        {(msg.sender === 'Ai') ? aiMessage(msg.message) : (
                                                                <span >
                                                                        {msg.message}
                                                                </span>
                                                        )}
                                                        {/* Copy Button */}
                                                        <button
                                                                onClick={() => navigator.clipboard.writeText(msg.message)}
                                                                className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 text-xs"
                                                        >
                                                                📋
                                                        </button>
                                                </div>
                                        ))}


                                </div>
                                <div className="h-16 w-full m-1 flex flex-row">
                                        <div className="h-full w-[86%]">
                                                <form className="h-full flex items-center w-full pl-2">
                                                        <input type="text" value={inputmessage} className="p-2 border w-full border-gray-400 rounded" placeholder="Send message" onChange={(e) => { setMessage(e.target.value); setInputMessage(e.target.value) }} />
                                                </form>
                                        </div>
                                        <div className="h-[86%] flex mt-1 justify-center items-center ml-2 rounded-lg w-12 hover:bg-gray-300" onClick={sendMessagetogroup}>
                                                <i className="ri-send-plane-2-fill text-3xl"></i>
                                        </div>
                                </div>
                        </div>
                        {modalOpen && (
                                <div className="fixed inset-0 bg-opacity-90 flex items-center justify-center">
                                        <div className="bg-white p-6 rounded-lg w-96">
                                                <div className="flex justify-between items-center mb-4">
                                                        <h3 className="text-lg font-bold">Select Collaborator</h3>
                                                        <button
                                                                onClick={() => setModalOpen(false)}
                                                                className="text-gray-500 hover:text-gray-700"
                                                        >
                                                                <i className="ri-close-line text-xl"></i>
                                                        </button>
                                                </div>
                                                <div className="max-h-60 overflow-y-auto">
                                                        {users.map(user => (
                                                                <div
                                                                        key={user.email}
                                                                        onClick={() => {
                                                                                if (!selectedUser.includes(user.email)) {
                                                                                        setSelectedUser([...selectedUser, user.email]);
                                                                                }
                                                                        }}
                                                                        className={`p-2 cursor-pointer flex flex-row gap-3 hover:bg-gray-100 rounded ${selectedUser.includes(user.email) ? 'bg-blue-100' : ''
                                                                                }`}
                                                                >
                                                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center">
                                                                                <i class="ri-user-fill"></i>
                                                                        </div>
                                                                        {user.email}
                                                                </div>
                                                        ))}
                                                </div>
                                                <button className="bg-blue-600 w-full h-10 flex items-center justify-center text-white font-bold mt-2 rounded-lg" onClick={addUserToProject}>add collaborators  {loading && <i class="fa-solid fa-spinner fa-spin-pulse"></i>}</button>
                                        </div>
                                </div>
                        )}
                        <div ref={panelRef} className="sidepanel w-104 h-full absolute  top-0 ">
                                <ProjectUser setPanelOpen={setPanelOpen} allCollaborator={allCollaborator} />
                        </div>

                </>
        );
}

export default ProjectLeftPart;