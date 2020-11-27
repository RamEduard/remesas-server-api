import { gql } from 'apollo-server'

export default gql`
    type Hello {
        name: String
    }

    type Query {
        "Versión del API"
        version: String
        hello(name: String): Hello
    }
`