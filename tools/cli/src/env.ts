interface Envs {
	[key: string]: string;
}

export const setEnv = (envs: Envs): void =>
	Object.entries(envs).forEach(([key, value]) => {
		process.env[key] = value;
	});
