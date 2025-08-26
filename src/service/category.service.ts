type Category = {
    id: number,
    name: string,
    createdAt: string,
    editedAt: string
}
const getCategoryService = async () => {
    const url = `${process.env.BASE_API_URL}/category`
    try {
        const res = await fetch(url);
    } catch (error) {
        
    }
}