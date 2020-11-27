import AppRootDir from 'app-root-dir'

const resolvers = {
	Query: {
        version: () => {
			var pjson = require(`${AppRootDir.get()}/package.json`)
			return pjson.version
		},
    }
}

export default resolvers