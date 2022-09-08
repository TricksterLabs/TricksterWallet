<template>
  <q-page
    class="flex flex-center text-h2 text-weight-bolder"
  >
    <q-card class="bg-transparent no-shadow no-border">
      <q-card-section class="col-12 items-center">
        <q-btn
          label="Create Wallets"
          stack
          outline
          type="a"
          class="q-mr-md col-6 full-width"
          href="#/manage/create-wallets"
          color="primary"></q-btn>
        <q-btn
          label="Import Wallets"
          stack
          outline
          type="a"
          class="full-width"
          href="#/manage/import-wallets"
          color="positive"></q-btn>
        <q-btn
          label="Hardware Wallets"
          stack
          outline
          class="q-mr-md full-width"
          color="warning"></q-btn>
        <q-btn
          label="Export Wallets"
          stack
          outline
          class="full-width"
          color="negative"></q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
</script>

<style>
.text {
  background: linear-gradient(to right, #30CFD0 0%, #330867 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
