import { AxiosInstance } from 'axios';

import { AppResponse, ReturnData } from './types';

export default class Cards {
    #instance: AxiosInstance;

	/**
     * @param {AxiosInstance} instance Authenticated Axios instance
     */
    constructor(instance: AxiosInstance) {
        this.#instance = instance;
    }

	private appResponse(req: any): AppResponse {
		switch(req.status) {
			case 200:
				return req.data.data;
			case 404:
				return { status: 404, error: "Not Found" };
			default:
				return { status: req.status,  error: "Unknown Error" };
		}
	}

	/**
	 * @returns {AppResponse} Returns a list of all available cards
	 * @param {ReturnData[]|string[]} filters
	 */
    public async getCard(id: string, filters: ReturnData[]|string[] = []) {
        return this.appResponse(await this.#instance.get(`cards/${id}`, {
			params: {
				select: filters.join(','),
			},
		}));
    }

	/**
	 * @param {string} name
	 * @param {string} subtype
	 * @param {string} type
	 * @param {ReturnData[]|string[]} filters
	 * @returns {AppResponse} Returns a list of all available cards
	 */
    public async searchByName(name: string, subtype: string, type: string, filters: ReturnData[]|string[] = []) {
        return this.appResponse((await this.#instance.get('cards', {
            params: {
                q: `${name ? `name:${name.trim()}` : ''} ${subtype ? `subtypes:${subtype.trim()}` : ''} ${type ? `types:${type.trim()}` : ''}`,
				select: filters.join(','),
            },
        })));
    }
}