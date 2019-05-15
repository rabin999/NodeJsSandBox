import { Router, Request, Response, NextFunction } from "express"
import PasswordResetController from "../controllers/passwordReset.controller"
import ResetPasswordRequest from "../request/resetPassword.request"

class ProjecTypeRoute {

    public _route: any
    
    constructor () 
    {
        this._route = Router()
        
        this._route.post("/forgetPassword", new PasswordResetController().forgetPassword)
        this._route.put("/resetPassword/:token", ResetPasswordRequest, new PasswordResetController().resetPassword)
    }

    get route()
    {
        return this._route;
    }
}

export default ProjecTypeRoute