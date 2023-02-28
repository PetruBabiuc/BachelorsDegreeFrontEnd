import { GenreIdToSongsCount } from "./GenreIdToSongsCount";

export interface CrawlerState {
    isStarted: boolean,
    domain: string,
    resourcesUrlsCount: number,
    genreIdToSongsCount: GenreIdToSongsCount[]
}