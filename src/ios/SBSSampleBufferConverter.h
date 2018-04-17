//
//  SBSSampleBufferConverter.h
//  HelloCordova
//
//  Created by Luca Torella on 16.04.18.
//

#import <UIKit/UIKit.h>
#import <CoreMedia/CoreMedia.h>

@interface SBSSampleBufferConverter : NSObject

+ (NSString *)base64StringFromFrame:(CMSampleBufferRef)frame;

@end
