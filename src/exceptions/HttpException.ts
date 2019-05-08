import ExceptionParser from "../services/parser/ExceptionParser"
import  { HttpExceptionInterface, ParamsInterface } from "../interfaces/HttpException.interface"

class HttpException extends Error implements HttpExceptionInterface {

    public params: any
    public options: any

    /**
     * @param  {object} params
     * @param  {object={}} options
     */
    constructor (params: ParamsInterface, options: any = {})
    {   
        super(params.message)
        this.params = params
        this.options = options
    }

    // return type should be array
    public parse()
    {
        return new ExceptionParser(this.params).parse()
    }
}

export default HttpException