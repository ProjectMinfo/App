'use client';
import { Card, Button } from '@nextui-org/react';

interface ModifyCardProps {
  title: string;
  description: string;
}

export default function ModifyCard({ title, description }: ModifyCardProps) {
  return (
    <Card className="p-4 relative my-3">
      <div className="flex">
        <div className="flex-1">
          <h4>{title}</h4>
          <p className="my-2">{description}</p>
        </div>
        <div className="flex flex-col">
          <Button>
            Modifier
          </Button>
          <Button color="danger" className="">
            Supprimer
          </Button>
        </div>
      </div>
    </Card>
  );
};
