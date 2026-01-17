<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query';
import { UseImage } from '@vueuse/components';
import { useVotables } from '~/lib/queries/votable';

const { data: votables, isLoading } = useQuery(useVotables());

const renderMarkdown = async (content: string) => {
  const markdownIt = await import('markdown-it');
  const md = markdownIt.default();
  return md.render(content);
};
</script>

<template>
  <div class="py-8 flex flex-col gap-8">
    <div>
      <h2 class="text-3xl text-center font-bold">
        Choose your candidate!
      </h2>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <template v-if="isLoading">
        <USkeleton
          v-for="i in 3"
          :key="i"
          class="aspect-4/5"
        />
      </template>

      <template v-else>
        <DefineState
          v-for="votable in votables"
          :key="votable.id"
          :value="false"
          #="{ state: [open, setOpen] }"
        >
          <UDrawer
            :open
            @update:open="setOpen"
          >
            <div
              class="group relative cursor-pointer"
              role="button"
            >
              <div class="absolute top-full inset-x-0">
                <span
                  class="inline-block w-full text-center text-muted pointer-events-none -translate-y-full opacity-0 group-hover:opacity-100 group-hover:translate-y-1/3 transition-transform duration-200"
                >
                  Click to view details
                </span>
              </div>

              <div
                class="relative flex flex-col bg-default border border-accented rounded-radius overflow-hidden hover:shadow-2xl hover:rounded-2xl transition-[box-shadow,border-radius]"
              >
                <img
                  :src="`https://i.pravatar.cc/500?u=${JSON.stringify(votable.id)}`"
                  class="w-full aspect-4/5 object-cover"
                  :alt="votable.data.title"
                >

                <div class="p-4 text-center">
                  <h2 class="text-xl font-semibold">
                    {{ votable.data.title }}
                  </h2>
                  <p class="text-muted">
                    {{ votable.data.subtitle }}
                  </p>
                </div>
              </div>
            </div>

            <template #content>
              <UContainer class="flex flex-col lg:flex-row gap-4 lg:gap-12 overflow-y-auto">
                <div class="h-[45vh] aspect-4/5 p-4 lg:p-0">
                  <UseImage :src="`https://i.pravatar.cc/500?u=${JSON.stringify(votable.id)}`">
                    <img
                      :src="`https://i.pravatar.cc/500?u=${JSON.stringify(votable.id)}`"
                      class="size-full bg-accented object-cover"
                      :alt="votable.data.title"
                    >

                    <template #loading>
                      <USkeleton class="size-full" />
                    </template>
                  </UseImage>
                </div>

                <div class="lg:max-h-[70vh] py-6 flex flex-col">
                  <div class="grow pb-20 flex flex-col gap-4 lg:overflow-y-auto">
                    <div class="flex flex-col">
                      <h2 class="text-4xl font-bold">
                        {{ votable.data.title }}
                      </h2>
                      <span class="text-muted italic">
                        {{ votable.data.subtitle }}
                      </span>
                    </div>

                    <AsyncState
                      :value="renderMarkdown(votable.data.desc)"
                      init=""
                      #="{ state }"
                    >
                      <div
                        class="prose"
                        v-html="state"
                      />
                    </AsyncState>
                  </div>

                  <div class="shrink-0 flex gap-4 pt-2">
                    <UButton
                      size="xl"
                      variant="outline"
                      color="neutral"
                      @click="setOpen(false)"
                    >
                      Close
                    </UButton>

                    <DefineState
                      :value="false"
                      #="{ state: [isModalOpen, setIsModalOpen] }"
                    >
                      <UModal
                        :open="isModalOpen"
                        title="Confirm Vote Selection"
                        :description="`Are you sure you want to vote for &quot;${votable.data.title}&quot?`"
                        :dismissible="false"
                        :close="false"
                        :ui="{ footer: 'justify-end' }"
                        @update:open="setIsModalOpen"
                      >
                        <UButton
                          size="xl"
                          class="grow justify-center shadow-lg"
                        >
                          Vote
                        </UButton>

                        <template #footer>
                          <UButton
                            label="Cancel"
                            color="neutral"
                            variant="outline"
                            @click="setIsModalOpen(false)"
                          />
                          <UButton
                            label="Proceed my selection"
                            color="success"
                            @click="setIsModalOpen(false)"
                          />
                        </template>
                      </UModal>
                    </DefineState>
                  </div>
                </div>
              </UContainer>
            </template>
          </UDrawer>
        </DefineState>
      </template>
    </div>
  </div>
</template>
