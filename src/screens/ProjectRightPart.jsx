import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

function ProjectRightPart(props) {
    const [allCurrentFile, setAllCurrentFile] = useState([]);
    const [currentOpenFile, setCurrentOpenFile] = useState("");
    const [editorContent, setEditorContent] = useState("");

    // Load file content when switching files
    useEffect(() => {
        if (currentOpenFile && props.fileTree[currentOpenFile]) {
            setEditorContent(props.fileTree[currentOpenFile].content || "");
        }
    }, [currentOpenFile, props.fileTree]);

    const handleFileClick = (file) => {
        setCurrentOpenFile(file);
        if (!allCurrentFile.includes(file)) {
            setAllCurrentFile(prev => [...prev, file]);
        }
    };

    return (
        <div className="w-full h-full flex flex-row">
            <div className="w-[55%] bg-gray-900 h-full flex flex-col">
                {/* File List */}
                <div className="w-full bg-gray-800 h-[98%] flex flex-row">
                    <div className="w-40 bg-gray-700 text-white font-bold flex flex-col items-start">
                        {Object.keys(props.fileTree).map((file, index) => (
                            <div key={index}>
                                <h1
                                    className="pl-2 p-2 text-sm text-white font-sm mb-1 w-full hover:bg-gray-600 cursor-pointer"
                                    onClick={() => handleFileClick(file)}
                                >
                                    {file}
                                </h1>
                                <hr className="border-gray-600" />
                            </div>
                        ))}
                    </div>

                    {/* Editor Section */}
                    <div className="flex flex-col h-full w-full">
                        {/* Open Tabs */}
                        <div className="w-full pl-2 h-[5%] bg-gray-800 flex flex-row gap-2">
                            {allCurrentFile.length > 0 &&
                                allCurrentFile.map((file) => (
                                    <h1
                                        key={file}
                                        className={`pt-1 py-1 px-3 cursor-pointer font-medium text-center flex items-center gap-2 ${
                                            currentOpenFile === file
                                                ? "bg-gray-700 text-white"
                                                : "bg-gray-900 text-gray-400"
                                        }`}
                                        onClick={() => setCurrentOpenFile(file)}
                                    >
                                        {file}
                                        <span
                                            className="cursor-pointer text-red-500"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setAllCurrentFile(allCurrentFile.filter(f => f !== file));
                                                if (currentOpenFile === file) {
                                                    setCurrentOpenFile(allCurrentFile[0] || "");
                                                }
                                            }}
                                        >
                                            x
                                        </span>
                                    </h1>
                                ))}
                        </div>

                        {/* Code Editor */}
                        {currentOpenFile && (
                            <div className="w-full h-[93.5%] bg-gray-900">
                                <CodeMirror
                                    value={editorContent}
                                    className="w-full h-full"
                                    theme="dark"
                                    extensions={[javascript()]}
                                    onChange={(value) => {
                                        console.log("New Value:", value);
                                        console.log("Before Update:", props.fileTree);
                                        
                                        props.setFileTree(prevFileTree => {
                                            console.log("Updating fileTree...");
                                            return {
                                                ...prevFileTree,
                                                [currentOpenFile]: { content: value },
                                            };
                                        });
                                    
                                        console.log("After Update:", props.fileTree);
                                    }}
                                    
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Side Panel */}
            <div className="w-[45%] bg-green-200 h-full border-left-2 border-black"></div>
        </div>
    );
}

export default ProjectRightPart;
