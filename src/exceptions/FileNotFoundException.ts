import HttpException from "./HttpException"

class FileNotFoundException extends HttpException {
    private static msg: string;

    constructor(message?: string) {
        FileNotFoundException.msg = "File not found";
        if (message) {
            FileNotFoundException.msg = message;
        }
        super({
            status: 404,
            message: FileNotFoundException.msg
        })
    }
}

export default FileNotFoundException
