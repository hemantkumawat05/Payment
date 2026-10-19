const isProduction = process.env.NODE_ENV === "production";

export const getCookieOptions = (extraOptions = {}) => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    ...extraOptions,
});

export const clearAuthCookies = (res) => {
    const baseOptions = {
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    };

    res.clearCookie("accessToken", { ...baseOptions, httpOnly: true });
    res.clearCookie("refreshToken", { ...baseOptions, httpOnly: true });
    res.clearCookie("csrfToken", { ...baseOptions, httpOnly: false });
};
