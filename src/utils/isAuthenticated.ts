export const checkAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
        return next() 
    }
    res.redirect("/api/auth/login");
}

export const addAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }

    return next();
}

export const checkLoggedIn = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) { return next() }
    res.redirect("/api/auth/reset-password");
}