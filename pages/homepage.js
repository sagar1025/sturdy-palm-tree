import dynamic from 'next/dynamic'
import { useMemo } from 'react'

const HomePage = () =>{
    const Map = useMemo(() => dynamic(
    () => import('./map'),
    { 
        loading: () => <p>A map is loading</p>,
        ssr: false
    }
    ), [/* list variables which should trigger a re-render here */])
    return <Map />
}

export default HomePage
