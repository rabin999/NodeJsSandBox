import Designation from "../../components/designation/model/designation.model"

class Seeder {
    constructor () {
        this.designationSeeder()
    }

    private designationSeeder () 
    {
        Designation.insertMany([
            {
                title: 'Chief Executing Officier'
            },
            {
                title: 'Director of Technology'
            },
            {
                title: 'Technology Manager'
            },
            {
                title: 'Project Manager'
            },
            {
                title: 'Software Engineer'
            },
            {
                title: 'Developer'
            },
            {
                title: 'Designer'
            },
            {
                title: 'Quality Control'
            }
        ])
    }
}

export default Seeder