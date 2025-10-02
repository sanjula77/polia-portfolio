'use client';

import { Zap } from 'lucide-react';
import { Marquee } from './marquee';

// React Icons - Better looking tech icons
import {
    FaReact,
    FaNodeJs,
    FaPython,
    FaGitAlt,
    FaFigma,
    FaHtml5,
    FaCss3Alt,
    FaJs,
    FaDatabase
} from 'react-icons/fa';
import {
    SiTypescript,
    SiNextdotjs,
    SiTailwindcss,
    SiPrisma,
    SiFirebase,
    SiVite,
    SiCloudflare,
    SiMarkdown,
    SiVitest,
    SiPostgresql,
    SiMysql,
    SiRadixui,
    SiPostman,
    SiMongodb,
    SiLaravel,
    SiFastapi,
    SiSupabase,
    SiLangchain,
    SiTensorflow,
    SiPytorch
} from 'react-icons/si';
import {
    TbBrandReactNative,
    TbApi
} from 'react-icons/tb';

const StacksCard = () => {
    return (
        <div className='flex h-70 flex-col overflow-hidden rounded-xl shadow-feature-card'>
            <div className='flex items-center gap-4 px-6 pt-6 pb-2'>
                <Zap className='size-[18px]' />
                <h2 className='text-sm font-medium'>Stacks</h2>
            </div>
            <div className='flex-1 flex flex-col justify-center gap-8 px-6 pb-10'>
                <Marquee gap='20px' className='py-2' fade pauseOnHover>
                    <FaReact className='w-12 h-12' style={{ color: '#61DAFB' }} />
                    <SiNextdotjs className='w-12 h-12 dark:invert' style={{ color: '#000000' }} />
                    <SiTypescript className='w-12 h-12' style={{ color: '#3178C6' }} />
                    <FaJs className='w-12 h-12' style={{ color: '#F7DF1E' }} />
                    <SiTailwindcss className='w-12 h-12' style={{ color: '#06B6D4' }} />
                    <FaPython className='w-12 h-12' style={{ color: '#3776AB' }} />
                    <SiFastapi className='w-12 h-12' style={{ color: '#009688' }} />
                    <SiLaravel className='w-12 h-12' style={{ color: '#FF2D20' }} />
                    <SiSupabase className='w-12 h-12' style={{ color: '#3ECF8E' }} />
                    <SiTensorflow className='w-12 h-12' style={{ color: '#FF6F00' }} />
                    <SiPytorch className='w-12 h-12' style={{ color: '#EE4C2C' }} />
                </Marquee>
                <Marquee gap='20px' className='py-2' reverse fade pauseOnHover>
                    <SiPostman className='w-12 h-12' style={{ color: '#FF6C37' }} />
                    <SiMongodb className='w-12 h-12' style={{ color: '#47A248' }} />
                    <SiPostgresql className='w-12 h-12' style={{ color: '#336791' }} />
                    <FaNodeJs className='w-12 h-12' style={{ color: '#339933' }} />
                    <FaGitAlt className='w-12 h-12' style={{ color: '#F05032' }} />
                    <SiVite className='w-12 h-12' style={{ color: '#646CFF' }} />
                    <SiPrisma className='w-12 h-12' style={{ color: '#2D3748' }} />
                    <SiFirebase className='w-12 h-12' style={{ color: '#FFCA28' }} />
                    <SiLangchain className='w-12 h-12' style={{ color: '#1C3C3C' }} />
                    <FaDatabase className='w-12 h-12' style={{ color: '#336791' }} />
                </Marquee>
            </div>
        </div>
    );
};

export default StacksCard;
