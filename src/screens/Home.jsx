import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user.context";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../config/axios";

function Home() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [IsModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [project, setProject] = useState([]);
  const [projectAdded, setProjectAdded] = useState(false);

  useEffect(() => {
    console.log("Fetching projects...");
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/project/get-all-projects", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("Fetched Projects:", response.data.projects);
        setProject([...response.data.projects]); // Force new reference
      } catch (err) {
        console.log("Error fetching projects:", err);
      }
    };

    fetchProjects();
    setProjectAdded(false);
  }, [projectAdded]);

  useEffect(() => {
    console.log("Updated State:", project);
  }, [project]);

  async function createProject(e) {
    const token = localStorage.getItem("token");
    e.preventDefault();
    axios
      .post(
        "/project/create",
        { name: projectName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        setIsModalOpen(false);
        setProjectAdded(true);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <>
      <main className="p-4">
        <div className="projects flex gap-4 items-center flex-col">
          <button
            className="project w-40 font-bold border-2 border-black h-10 rounded-lg bg-gray-100"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            New Project <i class="ri-link"></i>
          </button>
          <div>
            {project &&
              project.map((project, index) => {
                return (
                  <div>
                    <div
                      key={project._id}
                      className="flex justify-center w-50 h-20 rounded-lg font-bold items-center flex-col border-2 border-black hover:bg-gray-200"
                      onClick={() => {
                        navigate("/project", {
                          state: { project },
                        });
                      }}
                    >
                      <h1>{project.name}</h1>
                      <div className="flex flex-col gap-2">
                        <h2>
                          <i className="ri-user-3-fill"></i>{" "}
                          <>{project.users.length}</> Coordinator
                        </h2>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          {IsModalOpen && (
            <div className="fixed inset-2 flex items-center justify-center ">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl mb-4">Create Project</h2>
                <form onSubmit={createProject}>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="projectName"
                    >
                      Project Name
                    </label>
                    <input
                      type="text"
                      id="projectName"
                      name="projectName"
                      onChange={(e) => {
                        setProjectName(e.target.value);
                      }}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default Home;
