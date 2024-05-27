'user client';
import ModifyCard from '@/components/modifyCard';
import { postViandes } from '@/config/api';

export default async function GestionCarte() {

  await postViandes({});


  return (
    <div className="">
      <ModifyCard 
        title="Plat1" 
        description="Descriptioaaaaaaaaaaaaaaaaaaaan de la carte" 
      />
      <ModifyCard 
        title="Plat2" 
        description="Description de la carte"
      />

    </div>
  );
};