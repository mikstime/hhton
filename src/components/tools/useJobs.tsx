import {getJobs} from '../../model/api'
import {Id} from './use-app-state/user'

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
    return {
        getJobName: (id: string|number): string => {
            const j = jobs()
            return j[id] || ''
        },
        getJobId: (name: string): Id => {
            const j = jobs()
            for(let [k, v] of Object.entries(j)) {
                if(v === name) return k
            }
            return '-1'
        }
    }
}