import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchPetsByNationalId } from "@/features/pets/usePets";
import type { Pet } from "@/features/pets/types";
import { cn } from "@/lib/utils";
import { PawPrint, Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

interface PetSearchByNationalIdProps {
  selectedPetId?: number;
  onSelect: (pet: Pet) => void;
}

export function PetSearchByNationalId({ selectedPetId, onSelect }: PetSearchByNationalIdProps) {
  const { t } = useTranslation();
  const [nationalId, setNationalId] = useState("");
  const [searchedNationalId, setSearchedNationalId] = useState<string | undefined>();
  const { data: results, isFetching, isError } = useSearchPetsByNationalId(searchedNationalId);

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    setSearchedNationalId(nationalId);
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="owner-nationalId-search">{t("pets.form.ownerNationalId")}</Label>
            <Input
              id="owner-nationalId-search"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              placeholder={t("pets.form.nationalIdPlaceholder")}
            />
          </div>
          <Button type="submit" disabled={!nationalId || isFetching}>
            <Search className="size-4" />
            {t("common.search")}
          </Button>
        </form>

        {isFetching && (
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-9 w-40" />
          </div>
        )}

        {isError && <p className="mt-4 text-sm text-destructive">{t("petSearch.error")}</p>}

        {!isFetching && searchedNationalId && results?.length === 0 && (
          <p className="mt-4 text-sm text-muted-foreground">{t("petSearch.noResults")}</p>
        )}

        {!isFetching && results && results.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {results.map((pet) => (
              <button
                key={pet.id}
                type="button"
                onClick={() => onSelect(pet)}
                className={cn(
                  "flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                  selectedPetId === pet.id ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent"
                )}
              >
                <PawPrint className="size-4" />
                {pet.name} ({t(`enums.species.${pet.species}`, { defaultValue: pet.species })})
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
