export const getCategoriesFromAdmin = async (req, res) => {
  try {
    const response = await fetch(`${process.env.API_GATEWAY_URL}/api/admin/categories`);

    const text = await response.text();
    console.log("ADMIN RESPONSE:", text);

    if (!response.ok) {
      return res.status(response.status).json({
        message: "Failed to fetch categories from admin-service",
        error: text,
      });
    }

    const data = JSON.parse(text);

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching categories from admin-service:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};