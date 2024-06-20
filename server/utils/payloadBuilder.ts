/**
 * make himay to conver to object as payload for Axios
 * @param dataParameters
 */
export default function (dataParameters: string) {
	const payloadArray = dataParameters.split("\n");

	const payload = {};

	payloadArray.forEach((item: string) => {
		const itemArr = item.split("=");
		payload[itemArr[0]] = itemArr[1];
	});

	return payload;
}
