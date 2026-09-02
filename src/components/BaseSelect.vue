<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'

interface OptionObject {
  label: string
  value: string | number
}

type OptionItem = string | OptionObject

const props = withDefaults(
  defineProps<{
    modelValue: string | number
    options: OptionItem[]
    placeholder?: string
    disabled?: boolean
  }>(),
  {
    placeholder: 'Select an option',
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const isOpen = ref(false)
const selectRef = ref<HTMLElement | null>(null)

const normalizedOptions = computed<OptionObject[]>(() => {
  return props.options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return opt
    }
    return { label: String(opt), value: opt }
  })
})

const selectedOption = computed(() => {
  return normalizedOptions.value.find((opt) => opt.value === props.modelValue)
})

const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

const selectOption = (opt: OptionObject) => {
  emit('update:modelValue', opt.value)
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (props.disabled) return
  if (event.key === 'Escape') {
    isOpen.value = false
  } else if (event.key === 'Enter' || event.key === ' ') {
    if (!isOpen.value) {
      event.preventDefault()
      isOpen.value = true
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div
    ref="selectRef"
    class="relative w-full"
    @keydown="handleKeyDown"
  >
    <button
      type="button"
      :disabled="disabled"
      @click="toggleDropdown"
      :class="[
        'w-full px-3.5 py-2.5 bg-[var(--bg-primary)] border rounded-xl text-xs sm:text-sm text-left flex items-center justify-between gap-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer',
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-zinc-700',
        isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-[var(--border-color)]'
      ]"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
    >
      <span
        :class="[
          'truncate font-medium',
          selectedOption ? 'text-[var(--text-primary)]' : 'text-zinc-500'
        ]"
      >
        {{ selectedOption ? selectedOption.label : placeholder }}
      </span>
      <ChevronDown
        :class="[
          'w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0',
          isOpen ? 'rotate-180 text-blue-400' : ''
        ]"
      />
    </button>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform scale-95 opacity-0 -translate-y-1"
      enter-to-class="transform scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform scale-100 opacity-100 translate-y-0"
      leave-to-class="transform scale-95 opacity-0 -translate-y-1"
    >
      <ul
        v-if="isOpen"
        class="absolute z-50 w-full mt-1 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-xl max-h-60 overflow-auto focus:outline-none"
        role="listbox"
      >
        <li
          v-for="opt in normalizedOptions"
          :key="opt.value"
          @click="selectOption(opt)"
          :class="[
            'px-3.5 py-2 text-xs sm:text-sm cursor-pointer flex items-center justify-between transition-colors',
            opt.value === modelValue
              ? 'bg-blue-600/15 text-blue-400 font-semibold'
              : 'text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
          ]"
          role="option"
          :aria-selected="opt.value === modelValue"
        >
          <span class="truncate">{{ opt.label }}</span>
          <Check v-if="opt.value === modelValue" class="w-4 h-4 text-blue-400 shrink-0" />
        </li>
      </ul>
    </Transition>
  </div>
</template>
