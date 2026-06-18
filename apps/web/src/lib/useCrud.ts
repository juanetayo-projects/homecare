import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

export function useCrud<T = Record<string, unknown>>(table: string, orderBy = 'nombre') {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  function q() {
    return supabase.from(table as never) as any
  }

  const load = useCallback(async () => {
    setLoading(true)
    const { data: result } = await q().select('*').order(orderBy, { ascending: true })
    if (result) setData(result)
    setLoading(false)
  }, [table, orderBy])

  useEffect(() => { load() }, [load])

  const create = async (values: Record<string, unknown>) => {
    const { error } = await q().insert(values)
    if (error) throw error
    await load()
  }

  const update = async (id: string, values: Record<string, unknown>) => {
    const { error } = await q().update(values).eq('id', id)
    if (error) throw error
    await load()
  }

  const remove = async (id: string) => {
    const { error } = await q().delete().eq('id', id)
    if (error) throw error
    await load()
  }

  return { data, loading, create, update, remove, reload: load }
}
