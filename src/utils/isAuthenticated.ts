export const checkAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
        return next() 
    }
    res.redirect("/user/sign-in");
}

export const addAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }

    return next();
}

export const checkLoggedIn = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) { return next() }
    res.redirect("/user/profile");
}