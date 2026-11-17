import Reveal from '../components/motion/Reveal'
import { HOME_SECTIONS } from '../features/home/sections'

// The sections and their order live in features/home/sections.js.
export default function Home() {
  return (
    <>
      {HOME_SECTIONS.map(({ id, Component, reveal }) =>
        reveal ? (
          <Reveal key={id}>
            <Component />
          </Reveal>
        ) : (
          <Component key={id} />
        ),
      )}
    </>
  )
}
