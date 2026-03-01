import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { PropertyInput } from "@/types/property";
import type { Json } from "@/integrations/supabase/types";

export function useCreateEvaluation() {
  const navigate = useNavigate();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: PropertyInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const inputData: Record<string, Json> = {
        method: input.method,
      };
      if (input.latitude !== undefined) inputData.latitude = input.latitude;
      if (input.longitude !== undefined) inputData.longitude = input.longitude;
      if (input.url) inputData.url = input.url;
      if (input.address) inputData.address = input.address;
      if (input.propertyType) inputData.propertyType = input.propertyType;
      if (input.bedrooms !== undefined) inputData.bedrooms = input.bedrooms;
      if (input.bathrooms !== undefined) inputData.bathrooms = input.bathrooms;
      if (input.sqft !== undefined) inputData.sqft = input.sqft;
      if (input.askingPrice !== undefined) inputData.askingPrice = input.askingPrice;
      if (input.notes) inputData.notes = input.notes;
      if (input.photos) inputData.photoCount = input.photos.length;

      const { data, error } = await supabase
        .from("evaluations")
        .insert([{
          user_id: user.id,
          input_method: input.method,
          input_data: inputData,
          status: "pending",
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      navigate(`/analysis/${data.id}`);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}
