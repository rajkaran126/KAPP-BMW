import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { gsap } from 'gsap';

/**
 * Custom hook for scroll-based camera navigation
 * Maps scroll position to camera movement through 3D space
 */
export const useScrollCamera = (sections = []) => {
    const { camera } = useThree();
    const [activeSection, setActiveSection] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight - windowHeight;
            const scrollProgress = docHeight > 0 ? scrollY / docHeight : 0;

            // Determine active section
            const sectionIndex = Math.min(
                Math.floor(scrollProgress * sections.length),
                sections.length - 1
            );
            setActiveSection(sectionIndex);

            // Get current section camera position
            const section = sections[sectionIndex];
            if (section && section.cameraPosition) {
                // Smooth camera transition using GSAP
                gsap.to(camera.position, {
                    x: section.cameraPosition[0],
                    y: section.cameraPosition[1],
                    z: section.cameraPosition[2],
                    duration: 1.5,
                    ease: 'power2.out',
                });

                // Update camera lookAt if provided
                if (section.lookAt) {
                    gsap.to(camera.rotation, {
                        x: section.lookAt[0],
                        y: section.lookAt[1],
                        z: section.lookAt[2],
                        duration: 1.5,
                        ease: 'power2.out',
                    });
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial call

        return () => window.removeEventListener('scroll', handleScroll);
    }, [camera, sections]);

    return { activeSection };
};

export default useScrollCamera;
