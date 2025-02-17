export const getUser = async () => {
    try {
        const response = await fetch("/auth/checkAuth");
        const data = await response.json();
        return data?.message === "Unauthorized" ? null : data.user;

    } catch (err) {
        console.error("Error checking auth:", err);
        throw err;
    }
};

export const login = async (email, password) => {
  try {
      return await fetch("/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password}),
    });
  } catch (err) {
    console.error("Error logging in:", err);
    throw err;
  }
};

export const logout = async () => {
  try {
    const response = await fetch("/auth/logout");
    return response.json();
  } catch (err) {
    console.error("Error logging out:", err);
    throw err;
  }
};

export const register = async (email, username, password) => {
  try {
    const response = await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });
    return response.json();
  } catch (err) {
    console.error("Error registering:", err);
    throw err;
  }
};
