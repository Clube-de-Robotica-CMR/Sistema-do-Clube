export interface HashService 
{
    hash(plain_text: string): Promise<string>
    compare(plain_text: string, hash: string): Promise<boolean>
}