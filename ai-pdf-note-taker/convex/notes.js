import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const AddNotes=mutation({
    args:{
        fileId:v.string(),
        notes:v.any(),
        createdBy:v.string()
    },
    handler:async(ctx,args)=>{
        const record=await ctx.db.query('notes')
        .filter((q)=>q.eq(q.field('fileId'),args.fileId)).collect();

        if(record?.length==0){
            await ctx.db.insert('notes',{
                fileId:args.fileId,
                notes:args.notes,
                createdBy:args.createdBy
            })
        }
        else{
            await ctx.db.patch(record[0]._id,{notes:args.notes})
        }
    }
})

export const GetNotes = query({
    args: {
        fileId: v.string(),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.query('notes')
            .filter((q) => q.eq(q.field('fileId'), args.fileId))
            .collect();

        // Check if result is empty to prevent accessing undefined
        if (result.length === 0) {
            return null;  // Return null or an empty object instead of throwing an error
        }

        return result[0].notes;
    }
});

