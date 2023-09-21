import { FC, useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { api } from "@/lib/axios";

interface IPrompts {
    id: string;
    title: string;
    template: string
}

interface IPrompSelectProps {
    onPromptSelect: (template: string) => void;
}

const PromptSelect: FC<IPrompSelectProps> = ({ onPromptSelect }) => {
    const [prompts, setPrompts] = useState<IPrompts[] | null >(null);

    useEffect(() => {
        api.get('/prompts').then(response => {
            console.log('response,data', response.data);
            setPrompts(response.data)})
    },[])

const handlePromptSelected = (promptId: string) => {
    const selectedPrompt = prompts?.find(p => p.id === promptId)

    if(!selectedPrompt) return;
    onPromptSelect(selectedPrompt.template);
}


  return (
    <Select onValueChange={handlePromptSelected}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione um prompt..." />
      </SelectTrigger>
      <SelectContent>
        {prompts?.map((prompt) => (
            <SelectItem key={prompt.id} value={prompt.id}>{prompt.title}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PromptSelect;
