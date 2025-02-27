import { Calendar, Tag, X } from "lucide-react";
import { Button } from "../../components/button";
import { FormEvent } from "react";
import { api } from "../../lib/axios";
import { useParams } from "react-router-dom";
import { Trip } from ".";
import { format } from "date-fns";
import { toast } from "react-toastify";

type CreateActivyModalProps = {
  closeCreateActivityModal: () => void;
  trip: Trip | undefined;
};

export function CreateActivyModal({
  closeCreateActivityModal,
  trip
}: CreateActivyModalProps) {
  
  const { tripId } = useParams();

  async function createActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const title = data.get('title')?.toString();
    const occurs_at = data.get('occurs_at')?.toString();
    
    if (!title || !occurs_at) return;

    const toastId = toast.loading("Um momento...");

    await api.post(`/trips/${tripId}/activities`, {
      title,
      occurs_at
    })
      .then(() => {
        toast.update(toastId, {
          render: "Atividade Cadastrada!",
          type: "success",
          isLoading: false,
          autoClose: 1500
        });
        window.document.location.reload();
      })
      .catch((error) => {
        console.error(error);
        toast.update(toastId, {
          render: "Erro ao cadastrar atividade. Tente novamente.",
          type: "error",
          isLoading: false,
          autoClose: 2500
        });
      });
  };

  const formatDateTimeLocal = (dateString: string) => {
    return format(new Date(dateString), "yyyy-MM-dd'T'HH:mm");
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Confirmar criação da viagem</h2>
            <button onClick={closeCreateActivityModal}>
              <X />
            </button>
          </div>
          <p className="text-sm text-zinc-400">
            Todos convidados podem visualizar as atividades.
          </p>
        </div>

        <form onSubmit={createActivity} className="space-y-3">

          <div className="h-14 px-4 bg-zinc-950 border-zinc-800 rounded-lg flex items-center gap-2">
            <Tag className="text-zinc-400 size-5" />
            <input
              name="title"
              placeholder="Qual a atividade?"
              className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-14 flex-1 px-4 bg-zinc-950 border-zinc-800 rounded-lg flex items-center gap-2">
              <Calendar className="text-zinc-400 size-5" />
              <input
                type="datetime-local"
                name="occurs_at"
                placeholder="Data e horário da atividade"
                className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"  
                min={trip ? formatDateTimeLocal(trip.starts_at) : ""}
                max={trip ? formatDateTimeLocal(trip.ends_at) : ""}             
              />
            </div>
          </div>
          
          <Button size="full">
            Salvar atividade
          </Button>
        </form>

      </div>
    </div>
  )
};
