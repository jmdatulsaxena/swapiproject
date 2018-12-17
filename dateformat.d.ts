interface __DateFormat
{
    (date: Date, format: string): string;
    
    masks: {};
} 

declare var dateFormat: __DateFormat;

export = dateFormat;