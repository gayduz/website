import { NodeType, Schema } from "prosemirror-model";

export function getTableNodeTypes(schema: Schema): { [key: string]: NodeType } {
	if (schema.cached.tableNodeTypes) {
		return schema.cached.tableNodeTypes;
	}

	const roles: { [key: string]: NodeType } = {};

	for (const type of Object.keys(schema.nodes)) {
		const nodeType = schema.nodes[type];

		if (nodeType.spec.tableRole) {
			roles[nodeType.spec.tableRole] = nodeType;
		}
	}

	schema.cached.tableNodeTypes = roles;

	return roles;
}
