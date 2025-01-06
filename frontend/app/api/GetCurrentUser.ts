import axios from "axios";


export const GetCurrentUser = async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const response = await axios.get(baseUrl + "/current-user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.user
  } catch (error){
    console.error("Error fetching current user:", error);
    return null;
  }
}