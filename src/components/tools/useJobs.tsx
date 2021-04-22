import {getJobs} from '../../model/api'

const initJobs = async (): Promise<{[key: string]: string}> => {
    const j = await getJobs()
    return j.reduce((a, v) => ({...a, [v.id]: v.name}), {})
}
const jobs = (() => {
    let j:{[key: string]: string}
    return () => {
        if(!j) {
            initJobs().then(jobs => j = jobs)
        }
        return j
    }
})()

jobs()

export const useJobs = () => {
    return (id: string) => {
        const j = jobs()
        return j[id] || ''
    }
}