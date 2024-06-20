/**
 * make himay to conver to object as payload for Axios
 * @param dataParameters
 */
export default function (dataParameters: string) {
	const payloadArray = dataParameters.split("\n");
	const payload: { [key: string]: string } = {};

	for (const item of payloadArray) {
		const itemArr = item.split("=");
		payload[itemArr[0]] = itemArr[1];
	}

	return payload;
}
