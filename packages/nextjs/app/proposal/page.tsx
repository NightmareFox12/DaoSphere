'use client';
import { BellAlertIcon, BellIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'motion/react';
import { NextPage } from 'next';
import { useState } from 'react';
import { InputBase } from '~~/components/scaffold-stark';

const Proposal: NextPage = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isNotification, setIsNotification] = useState<boolean>(false);

  return (
    <section className='w-full h-full flex flex-1 justify-center items-center'>
      <article className='flex flex-col bg-base-300 border border-gradient rounded-xl p-5 lg:w-7/12'>
        <div className='flex justify-between items-center'>
          <div className='flex flex-1 items-center justify-center'>
            <p className='text-center text-2xl font-bold mb-5'>Proposal 1</p>
          </div>

          <div
            className='tooltip tooltip-primary tooltip-top'
            data-tip='By pressing the notification button, you will activate automatic alerts that will inform you every time a new vote is registered.'
          >
            <button
              className={`${isNotification && 'btn-active'} btn btn-circle btn-outline`}
              onClick={() => setIsNotification(!isNotification)}
            >
              <AnimatePresence>
                {isNotification ? (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BellAlertIcon className='w-6 h-6' />
                  </motion.span>
                ) : (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BellIcon className='w-6 h-6' />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
        <div className='w-full px-8 flex flex-col gap-8 my-4'>
          <div className='flex flex-col'>
            <p className='text-lg m-1 font-bold'>
              Title <span className='text-error font-bold'>*</span>
            </p>
            <InputBase placeholder='Title' value={title} onChange={setTitle} />
          </div>

          <div className='flex flex-col'>
            <p className='text-lg m-1 font-bold'>
              Description <span className='text-error font-bold'>*</span>
            </p>
            <InputBase
              placeholder='Description'
              value={description}
              onChange={setDescription}
            />
          </div>
          {/*
          verificar en la pagina si se puede crear una votacion usuario, solo admin o admin y advisor z
          TODO: agregar un checkbox para elegir si es respuesta de si o no, o es de opciones personalizadas
          
          si es de opciones personalizadas, agregar un input para agregar las opciones
          agrgar el tiempo de duracion de la votacion

          tambien agregar evento y mostrarselo al usuario owner nadamas

          
          */}
        </div>
        <button className='btn btn-accent mx-auto px-16'>Create</button>
      </article>
    </section>
  );
};

export default Proposal;
