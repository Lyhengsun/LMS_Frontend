import ApiResponse from "../type/ApiResponse";
import Category from "../type/Category";

export const getCategoryService = async () => {
    const url = `${process.env.BASE_API_URL}/category`
    try {
        const res = await fetch(url);
        const data : ApiResponse<Category[]> = await res.json(); 
        return data;      
    } catch (error) {
        console.log(error);
    }
}