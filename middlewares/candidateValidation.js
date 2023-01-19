const candidateSchema = {
	type: "object",
	required: ["candidateName"],
	properties: {
		candidateName: {
			type: "string",
			minLength: 1,
		},
	},
};

module.exports = candidateSchema;