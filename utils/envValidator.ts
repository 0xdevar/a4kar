import { colours, background, emojis} from './logger';

export function ensureEnv(variable: string): string {
    variable = variable.toUpperCase()
    const env = process.env[variable];
    if (env) {
        return env;
    } else {
        console.log(colours.red , `[${emojis.error}] ${variable} was missing in env file`, colours.reset)
        process.exit(1)
    }
}