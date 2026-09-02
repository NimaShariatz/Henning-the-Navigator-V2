a good source of maps: https://unwritten-record.blogs.archives.gov/2017/02/21/recently-opened-series-german-world-war-ii-maps/

# Installations
- React 19 created with `npm create vite@latest frontend` using the React Compiler for increased optimization. Do not have to use useMemo()


# npm install
- `react-router`: for page routing
- `--save-dev prettier husky lint-staged` and `npx husky init` & `npx lint-staged` & back in root folder, `git config core.hooksPath frontend/.husky`: Prettier installation for code cleanup on commits.
- `axios`: to make life easier with fetching and sending data with ReactJS. Cleans up the syntax a bit in /api
- `gsap`: used for animating some threejs stuff
- `three@0.169.0`: core threejs library. 0.169 to avoid a 'warning for THREE.Clock being depracted (browser console warning)'
- `-D @types/three`: TypeScript definitions for Three. Dev dependency
- `react-three/fiber`: Cuts down on ThreeJS syntax by using React componentization
- `@react-three/drei`: For effects and helpers