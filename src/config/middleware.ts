import express from 'express';
export function flashHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.locals.flash = {
        "success": req.flash("success"),
        "error": req.flash("error"),
    }

    next();
}