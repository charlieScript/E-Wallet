import bcrypt from 'bcrypt'


export const hash = async (data: string) => {
  return await bcrypt.hash(data, 10)
}

export const compare = async (data: string, hash: string) => {
  return await bcrypt.compare(data, hash)
}


