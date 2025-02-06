import { useEffect } from "react";

function ProjectUser(props) {
    return (
        <>
            <div className="h-full w-full pt-1 flex flex-col gap-3 bg-white">
                <div className="w-[100%] h-13 bg-green-200 font-bold text-xl pl-5 cursor-pointer relative flex items-center ">
                    Collaborators
                    <i className="ri-close-circle-fill ml-55 text-4xl" onClick={() => { props.setPanelOpen(false) }}></i>
                </div>
                {
                    Array.isArray(props.allCollaborator) && props.allCollaborator.map((user, index) => {
                        return (
                            <div key={index} className="w-[95%] cursor-pointer h-13 flex items-center pl-4 hover:bg-gray-200 gap-5 rounded-lg">
                                <div className="flex rounded-full justify-center items-center w-10 h-10 bg-gray-200 overflow-hidden"> <i className="ri-user-3-fill text-lg"></i></div>
                                {user}
                            </div>
                        );
                    })
                }
            </div>
        </>
    );
}

export default ProjectUser;